const make=(slug,folder,name,description,category,visuals,tags)=>({
  id:`ShotCraft-${slug}`,slug,name,description,category,compatibleVisuals:[...visuals,'editorial_story'],
  tags:tags.map(([zh,en])=>({zh,en})),
  preview:{poster:`media/poster/${slug}.png`,mp4:`media/${slug}.mp4`,durationSeconds:12},
  source:{adapter:'shotcraft-native',component:`templates/${folder}/${slug}.tsx`,schema:`templates/${folder}/schema.json`,sampleData:`templates/${folder}/sample-data.json`}
});
module.exports=[
  make('PresenterDataTakeover','presenter-data-takeover',{zh:'主持人让位与数据接管',en:'Presenter-to-Data Handoff'},{zh:'主持人先设问，再缩为圆形小窗，让正负趋势图接管主画面；源视频时钟连续，最后聚焦关键季度。',en:'A presenter poses a question, shrinks into a circular inset, and hands the frame to a signed trend chart with a retained focal period.'},'presenter_explainer',['presenter','bar_chart','time_series'],[['圆形小窗','Circular inset'],['主画面交接','Frame handoff'],['正负趋势','Signed trend']]),
  make('ContrastContributionStory','contrast-contribution-story',{zh:'反差设问与贡献拆解',en:'Contrast Hook & Contribution Story'},{zh:'先用醒目数字建立反差，再逐项累积正负贡献；起点、变化与终点来自同一账本，可核对而不是只做视觉隐喻。',en:'A bold hook leads into a signed contribution bridge, with a computed endpoint and a checkable shared scale.'},'waterfall_chart',['waterfall_chart','categorical_data'],[['反差开场','Contrast hook'],['正负贡献','Signed contributions'],['账本核对','Computed endpoint']]),
  make('PersistentTierBoard','persistent-tier-board',{zh:'持续分层与证据更新',en:'Persistent Tier Board'},{zh:'保留分层板和已出现对象，按明确阈值移动更新对象；支持改善与回落，不把主观档位伪装成数值排名。',en:'Keep a tier board alive as evidence changes. Entities move according to explicit thresholds, supporting improvements and declines.'},'ranking_reveal',['tier_board','categorical_data'],[['持续状态','Persistent state'],['分层迁移','Tier migration'],['阈值透明','Explicit thresholds']])
];
