import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';

type TransformState = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type EditableTransformProps = {
  id: string;
  role?: 'title' | 'chart' | 'subtitle' | 'annotation' | 'metric' | 'group' | 'kicker';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  initial?: Partial<TransformState>;
  disabled?: boolean;
  /**
   * When true, the wrapper renders as `position: static` instead of
   * `position: relative`, so it does NOT create a new CSS containing block.
   *
   * Use this when the direct child already has `position: absolute` and its
   * `top`/`right`/`bottom`/`left` values should be resolved against an
   * ancestor further up the tree (e.g. the card container), not against this
   * EditableTransform wrapper.
   *
   * Without this flag, EditableTransform's own `position: relative` wrapper
   * would become the containing block and offset the child from where you
   * intended it to appear.
   */
  noPositionContext?: boolean;
};

type EditableSelectionDetail = {
  id: string | null;
  role: NonNullable<EditableTransformProps['role']> | null;
  target?: {
    tagName: string;
    className?: string;
    text?: string;
    index?: number;
  };
  rect?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

type EditableTransformChangedDetail = {
  id: string;
  role: NonNullable<EditableTransformProps['role']>;
  transform: TransformState;
};

type EditableSceneContextValue = {
  scene?: any;
  sceneContent?: any;
};

const ACCENT = '#6366f1';
const ACCENT_SOFT = 'rgba(99, 102, 241, 0.28)';

export const EditableSceneContext = React.createContext<EditableSceneContextValue>({});

function coerceTransform(value: unknown): Partial<TransformState> | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const out: Partial<TransformState> = {};
  if (typeof raw.x === 'number') out.x = raw.x;
  if (typeof raw.y === 'number') out.y = raw.y;
  if (typeof raw.scale === 'number') out.scale = raw.scale;
  if (typeof raw.rotation === 'number') out.rotation = raw.rotation;
  return Object.keys(out).length > 0 ? out : null;
}

function getSvgTargetInfo(target: Element, root: HTMLElement | null): EditableSelectionDetail['target'] | undefined {
  const svgTarget = target.closest('text,rect,path,circle,line,polyline,polygon,g');
  if (!svgTarget || !root?.contains(svgTarget)) return undefined;

  const tagName = svgTarget.tagName.toLowerCase();
  const className =
    typeof svgTarget.getAttribute === 'function'
      ? svgTarget.getAttribute('class') ?? undefined
      : undefined;
  const sameTag = Array.from(root.querySelectorAll(tagName));
  const index = sameTag.indexOf(svgTarget);
  const text = svgTarget.textContent?.trim();

  return {
    tagName,
    className,
    index: index >= 0 ? index : undefined,
    text: text || undefined,
  };
}

function isInsideEditableInteraction(target: Element | null): boolean {
  if (!target) return false;
  return Boolean(target.closest(
    '[data-dm-editable-id],[data-dm-handle],[data-dm-move-handle],[data-dm-toolbar],[data-dm-dropdown],[data-controls]',
  ));
}

function isPointInsideContentRect(
  event: Pick<PointerEvent | React.PointerEvent, 'clientX' | 'clientY'>,
  wrapper: HTMLElement | null,
  rect: {x: number; y: number; w: number; h: number} | null,
): boolean {
  if (!wrapper || !rect) return true;
  // contentRect is stored in layout coordinates relative to the wrapper. To
  // hit-test against pointer client coords (visual pixels) we need to apply
  // the outer scale factor that Remotion's <Player> applies to the wrapper.
  // We derive it from whichever wrapper dimension is reliable so the wrapper
  // collapsing on one axis (e.g. absolute-positioned children) doesn't break
  // the test.
  const wrapperRect = wrapper.getBoundingClientRect();
  let scale = 1;
  if (wrapper.offsetWidth > 0 && wrapperRect.width > 0) {
    scale = wrapperRect.width / wrapper.offsetWidth;
  } else if (wrapper.offsetHeight > 0 && wrapperRect.height > 0) {
    scale = wrapperRect.height / wrapper.offsetHeight;
  }
  const safeScale = scale || 1;
  const pad = 8;
  const left = wrapperRect.left + rect.x * safeScale - pad;
  const top = wrapperRect.top + rect.y * safeScale - pad;
  const right = left + rect.w * safeScale + pad * 2;
  const bottom = top + rect.h * safeScale + pad * 2;
  return event.clientX >= left && event.clientX <= right && event.clientY >= top && event.clientY <= bottom;
}

function exitActiveTextEdit() {
  const active = document.activeElement as HTMLElement | null;
  if (active?.isContentEditable) active.blur();
  document.querySelectorAll<HTMLElement>('[data-dm-text-editable][contenteditable="true"]').forEach((el) => {
    if (el === active) return;
    el.contentEditable = 'false';
    el.style.cursor = '';
    el.style.userSelect = '';
    el.style.webkitUserSelect = '';
    el.style.background = '';
  });
  window.getSelection()?.removeAllRanges();
}

function getInitialEditMode() {
  if (typeof window === 'undefined') return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get('readonly') === '1' || params.get('edit') === '0') return false;
  return true;
}

function useEditMode() {
  // Normal generated-video previews stay editable by default. Template/gallery
  // iframes opt out with readonly=1/edit=0 so library examples cannot be edited.
  const [editMode, setEditMode] = useState(getInitialEditMode);

  useEffect(() => {
    const onEvent = (event: Event) => {
      const custom = event as CustomEvent<{enabled?: boolean}>;
      setEditMode(Boolean(custom.detail?.enabled));
    };
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'set-edit-mode') {
        setEditMode(Boolean(event.data.enabled));
      }
    };

    window.addEventListener('dm-edit-mode', onEvent);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('dm-edit-mode', onEvent);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return editMode;
}

export const EditableTransform: React.FC<EditableTransformProps> = ({
  id,
  role = 'group',
  children,
  style,
  className,
  initial,
  disabled = false,
  noPositionContext = false,
}) => {
  const editMode = useEditMode();
  const sceneContext = useContext(EditableSceneContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const {transform: styleTransform, ...restStyle} = style ?? {};
  const [selected, setSelected] = useState(false);
  const savedTransform = useMemo(() => {
    const fromContent = sceneContext.sceneContent?.layout_overrides?.[id]?.transform;
    const fromScene = sceneContext.scene?.content?.layout_overrides?.[id]?.transform;
    return coerceTransform(fromContent ?? fromScene);
  }, [id, sceneContext.scene, sceneContext.sceneContent]);
  const resolvedInitial = useMemo((): TransformState => ({
    x: savedTransform?.x ?? initial?.x ?? 0,
    y: savedTransform?.y ?? initial?.y ?? 0,
    scale: savedTransform?.scale ?? initial?.scale ?? 1,
    rotation: savedTransform?.rotation ?? initial?.rotation ?? 0,
  }), [initial?.rotation, initial?.scale, initial?.x, initial?.y, savedTransform]);
  const resolvedInitialKey = `${resolvedInitial.x}|${resolvedInitial.y}|${resolvedInitial.scale}|${resolvedInitial.rotation}`;
  const [transform, setTransform] = useState<TransformState>(resolvedInitial);

  useEffect(() => {
    setTransform(resolvedInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedInitialKey]);

  // Measured bounds of the actual visible content (e.g. the rendered text inside a wider wrapper)
  // so the selection chrome hugs the text rather than spanning the full block-width container.
  const [contentRect, setContentRect] = useState<{x: number; y: number; w: number; h: number} | null>(null);

  // When noPositionContext=true the wrapper is position:static, so chrome children
  // (position:absolute) resolve against the nearest positioned ancestor instead of
  // this wrapper. We compensate by adding the wrapper's own offsetLeft/Top so the
  // chrome still appears at the correct visual location.
  const [noCtxOffset, setNoCtxOffset] = useState<{x: number; y: number}>({x: 0, y: 0});
  useEffect(() => {
    if (!noPositionContext || !selected || !rootRef.current) return;
    setNoCtxOffset({x: rootRef.current.offsetLeft, y: rootRef.current.offsetTop});
  }, [noPositionContext, selected, contentRect]);

  useEffect(() => {
    if (!selected || !editMode) {
      setContentRect(null);
      return;
    }
    const wrapper = rootRef.current;
    if (!wrapper) return;

    const isChromeAttr = (el: Element) =>
      el.hasAttribute('data-dm-handle') ||
      el.hasAttribute('data-dm-pointer-pass-through') ||
      el.hasAttribute('data-dm-move-handle');

    const measure = () => {
      const w = rootRef.current;
      if (!w) return;
      // For charts with natural dimensions, the wrapper IS the chart bounds.
      // But when the chart SVG child is position:absolute, the wrapper collapses
      // to height:0 — fall through to measure the actual child in that case.
      if (role === 'chart' && w.offsetHeight > 0) {
        setContentRect({x: 0, y: 0, w: w.offsetWidth, h: w.offsetHeight});
        return;
      }
      const child = Array.from(w.children).find(c => !isChromeAttr(c)) as HTMLElement | undefined;
      if (!child) return;
      // The editable child is often absolutely positioned and may contain
      // animated transforms. Its element box is the draggable/editable target;
      // Range bounds can include clipped/offscreen glyphs and drift from what
      // the user sees.
      const rect = child.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const wRect = w.getBoundingClientRect();
      const viewportRect = document.body.getBoundingClientRect();
      const visibleLeft = Math.max(rect.left, viewportRect.left);
      const visibleTop = Math.max(rect.top, viewportRect.top);
      const visibleRight = Math.min(rect.right, viewportRect.right);
      const visibleBottom = Math.min(rect.bottom, viewportRect.bottom);
      const visibleRect = visibleRight > visibleLeft && visibleBottom > visibleTop
        ? {
          left: visibleLeft,
          top: visibleTop,
          width: visibleRight - visibleLeft,
          height: visibleBottom - visibleTop,
        }
        : rect;
      // The chrome (outline + handles) is rendered as absolute children of the
      // wrapper using layout pixels. Both wrapper and chrome get scaled by the
      // outer Remotion <Player> transform, so contentRect must be expressed in
      // *layout* coordinates relative to the wrapper.
      //
      // We derive the visual→layout scale from whichever wrapper dimension is
      // reliable. When the wrapper's only child is position:absolute, its
      // offsetHeight collapses to 0 and the per-axis fallback used to wrongly
      // become 1 — leaving y values untouched while x was scaled, which made
      // the selection chrome drift up and shrink. Reusing scaleX for both axes
      // is safe because Remotion applies a uniform scale to the composition.
      let scale = 1;
      if (w.offsetWidth > 0 && wRect.width > 0) {
        scale = wRect.width / w.offsetWidth;
      } else if (w.offsetHeight > 0 && wRect.height > 0) {
        scale = wRect.height / w.offsetHeight;
      }
      const safeScale = scale || 1;
      setContentRect({
        x: (visibleRect.left - wRect.left) / safeScale,
        y: (visibleRect.top - wRect.top) / safeScale,
        w: visibleRect.width / safeScale,
        h: visibleRect.height / safeScale,
      });
    };

    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(wrapper);
    const child = Array.from(wrapper.children).find(c => !isChromeAttr(c)) as HTMLElement | undefined;
    if (child) obs.observe(child);
    return () => obs.disconnect();
  }, [selected, editMode, transform.scale, transform.rotation]);

  const emitTransformChanged = (next: TransformState) => {
    const detail: EditableTransformChangedDetail = {id, role, transform: next};
    window.dispatchEvent(new CustomEvent('dm-transform-changed', {detail}));
    window.parent?.postMessage({
      type: 'dm-transform-changed',
      id,
      role,
      transform: next,
    }, '*');
  };

  useEffect(() => {
    if (!editMode) setSelected(false);
  }, [editMode]);

  useEffect(() => {
    const onSelected = (event: Event) => {
      const custom = event as CustomEvent<{id?: string}>;
      if (custom.detail?.id === id) {
        setSelected(true);
      } else {
        if (custom.detail?.id == null) exitActiveTextEdit();
        setSelected(false);
      }
    };
    window.addEventListener('dm-editable-selected', onSelected);
    return () => window.removeEventListener('dm-editable-selected', onSelected);
  }, [id]);

  useEffect(() => {
    if (!editMode || disabled || !selected) return;
    const onPointerDown = (event: PointerEvent) => {
      if (isInsideEditableInteraction(event.target as Element | null)) return;
      const detail: EditableSelectionDetail = {id: null, role: null};
      window.dispatchEvent(new CustomEvent('dm-editable-selected', {detail}));
      window.parent?.postMessage({type: 'dm-editable-selected', id: null, role: null}, '*');
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, [disabled, editMode, selected]);

  const beginMove = (event: React.PointerEvent) => {
    if (!editMode || disabled) return;
    const nearestEditable = (event.target as Element).closest('[data-dm-editable-id]');
    if (nearestEditable && nearestEditable !== rootRef.current) return;
    const isMoveHandle = Boolean((event.target as Element).closest('[data-dm-move-handle]'));
    if ((event.target as Element).closest('[data-dm-handle]')) return;

    // 文本元素正在编辑（contentEditable=true）时，不要拦截以便能输入
    const textEditableEl = (event.target as Element).closest('[data-dm-text-editable]') as HTMLElement | null;
    if (textEditableEl && textEditableEl.isContentEditable) return;
    if (event.detail >= 2 && textEditableEl) return;
    if (role !== 'chart' && !isMoveHandle && !isPointInsideContentRect(event, rootRef.current, contentRect)) {
      const clearDetail: EditableSelectionDetail = {id: null, role: null};
      window.dispatchEvent(new CustomEvent('dm-editable-selected', {detail: clearDetail}));
      window.parent?.postMessage({type: 'dm-editable-selected', id: null, role: null}, '*');
      return;
    }

    // Chart blocks may be SVG, canvas, or HTML/CSS charts. Selecting the chart
    // wrapper should work for all of them, not only SVG data marks.

    if (role !== 'chart') {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) selection.removeAllRanges();
    }

    // 用拖拽阈值（5px）区分单击和拖拽
    setSelected(true);

    const rect = rootRef.current?.getBoundingClientRect();
    const detail: EditableSelectionDetail = {
      id,
      role,
      target: role === 'chart' ? getSvgTargetInfo(event.target as Element, rootRef.current) : undefined,
      rect: rect ? {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      } : undefined,
    };

    window.dispatchEvent(new CustomEvent('dm-editable-selected', {detail}));

    if (rect) {
      window.parent?.postMessage({
        type: 'dm-editable-selected',
        id,
        role,
        target: detail.target,
        rect: detail.rect,
      }, '*');
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = transform.x;
    const initialY = transform.y;
    const initialTransform = transform;
    const lastClient = {x: startX, y: startY};
    let isDragging = false;
    const DRAG_THRESHOLD = 5;

    const onMove = (moveEvent: PointerEvent) => {
      lastClient.x = moveEvent.clientX;
      lastClient.y = moveEvent.clientY;
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!isDragging) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        isDragging = true;
      }
      setTransform((prev) => {
        const next = {
          ...prev,
        x: initialX + dx,
        y: initialY + dy,
        };
        return next;
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (isDragging) {
        emitTransformChanged({
          ...initialTransform,
          x: initialX + (lastClient.x - startX),
          y: initialY + (lastClient.y - startY),
        });
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const beginScale = (event: React.PointerEvent) => {
    if (!editMode || disabled) return;
    event.preventDefault();
    event.stopPropagation();

    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const initialScale = transform.scale;
    const initialTransform = transform;
    let latestScale = initialScale;

    const onMove = (moveEvent: PointerEvent) => {
      const nextDistance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
      if (startDistance < 1) return;
      latestScale = Math.max(0.2, Math.min(4, initialScale * (nextDistance / startDistance)));
      setTransform((prev) => ({
        ...prev,
        scale: latestScale,
      }));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (latestScale !== initialScale) emitTransformChanged({...initialTransform, scale: latestScale});
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const beginRotate = (event: React.PointerEvent) => {
    if (!editMode || disabled) return;
    event.preventDefault();
    event.stopPropagation();

    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
    const initialRotation = transform.rotation;
    const initialTransform = transform;
    let latestRotation = initialRotation;

    const onMove = (moveEvent: PointerEvent) => {
      const nextAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
      latestRotation = initialRotation + nextAngle - startAngle;
      setTransform((prev) => ({
        ...prev,
        rotation: latestRotation,
      }));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (latestRotation !== initialRotation) emitTransformChanged({...initialTransform, rotation: latestRotation});
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const showChrome = editMode && selected && !disabled;  // 所有角色都显示编辑框
  const showMoveHandle = false;
  const hs = 10;  // 控制点尺寸
  const handles: React.CSSProperties[] = [
    {top: -hs/2, left: -hs/2, cursor: 'nwse-resize'},
    {top: -hs/2, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize'},
    {top: -hs/2, right: -hs/2, cursor: 'nesw-resize'},
    {top: '50%', left: -hs/2, transform: 'translateY(-50%)', cursor: 'ew-resize'},
    {top: '50%', right: -hs/2, transform: 'translateY(-50%)', cursor: 'ew-resize'},
    {bottom: -hs/2, left: -hs/2, cursor: 'nesw-resize'},
    {bottom: -hs/2, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize'},
    {bottom: -hs/2, right: -hs/2, cursor: 'nwse-resize'},
  ];

  return (
    <div
      ref={rootRef}
      className={className}
      data-dm-drag="true"
      data-dm-editable-id={id}
      data-dm-role={role}
      onPointerDown={beginMove}
      style={{
        position: noPositionContext ? 'static' : 'relative',
        display: 'inline-block',
        ...restStyle,
        transform: `${styleTransform ? `${styleTransform} ` : ''}translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
        transformOrigin: 'center center',
        cursor: editMode && !disabled && role === 'chart' ? 'grab' : undefined,
        touchAction: editMode && role === 'chart' ? 'none' : undefined,
        userSelect: editMode ? 'none' : undefined,
        WebkitUserSelect: editMode ? 'none' : undefined,
      }}
    >
      {children}
      {showMoveHandle && (
        <button
          type="button"
          data-dm-move-handle="true"
          aria-label="Move editable block"
          title="Drag to move"
          style={{
            position: 'absolute',
            top: -18,
            left: -18,
            width: 28,
            height: 28,
            borderRadius: 999,
            border: `2px solid ${selected ? ACCENT : ACCENT_SOFT}`,
            background: selected ? ACCENT : 'rgba(15, 23, 42, 0.78)',
            color: '#ffffff',
            cursor: 'grab',
            zIndex: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            lineHeight: 1,
            padding: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
            userSelect: 'none',
          }}
        >
          ↕
        </button>
      )}
      {showChrome && contentRect && (() => {
        const {x, y, w, h} = contentRect;
        const pad = 4;
        // When noPositionContext=true the wrapper is position:static, so absolute
        // chrome children resolve against the nearest positioned ancestor (e.g. the
        // card). Add the wrapper's own layout offset so chrome still hugs the content.
        const ox = noCtxOffset.x;
        const oy = noCtxOffset.y;
        const cornerHandles = [
          {cx: x,         cy: y,         cursor: 'nwse-resize'},
          {cx: x + w/2,   cy: y,         cursor: 'ns-resize'},
          {cx: x + w,     cy: y,         cursor: 'nesw-resize'},
          {cx: x,         cy: y + h/2,   cursor: 'ew-resize'},
          {cx: x + w,     cy: y + h/2,   cursor: 'ew-resize'},
          {cx: x,         cy: y + h,     cursor: 'nesw-resize'},
          {cx: x + w/2,   cy: y + h,     cursor: 'ns-resize'},
          {cx: x + w,     cy: y + h,     cursor: 'nwse-resize'},
        ];
        return (
          <>
            <div
              data-dm-pointer-pass-through
              style={{
                position: 'absolute',
                left: ox + x - pad,
                top: oy + y - pad,
                width: w + 2 * pad,
                height: h + 2 * pad,
                border: `1.5px solid ${ACCENT}`,
                borderRadius: 6,
                pointerEvents: 'none',
                zIndex: 40,
              }}
            />
            <div
              data-dm-handle="rotate"
              onPointerDown={beginRotate}
              style={{
                position: 'absolute',
                left: ox + x + w/2 - 9,
                top: oy + y - 50,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: '#ffffff',
                border: `2.5px solid ${ACCENT}`,
                cursor: 'crosshair',
                zIndex: 42,
                boxSizing: 'border-box',
              }}
            />
            <div
              data-dm-pointer-pass-through
              style={{
                position: 'absolute',
                left: ox + x + w/2 - 1.25,
                top: oy + y - 32,
                width: 2.5,
                height: 28,
                background: ACCENT,
                pointerEvents: 'none',
                zIndex: 41,
              }}
            />
            {cornerHandles.map((handle, index) => (
              <div
                key={index}
                data-dm-handle="scale"
                onPointerDown={beginScale}
                style={{
                  position: 'absolute',
                  left: ox + handle.cx - hs/2,
                  top: oy + handle.cy - hs/2,
                  width: hs,
                  height: hs,
                  borderRadius: 2,
                  background: '#ffffff',
                  border: `2px solid ${ACCENT}`,
                  boxSizing: 'border-box',
                  cursor: handle.cursor,
                  zIndex: 42,
                }}
              />
            ))}
          </>
        );
      })()}
    </div>
  );
};

export default EditableTransform;
