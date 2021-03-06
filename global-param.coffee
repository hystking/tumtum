HIRAGINO_GOTHIC = "\"Hiragino Kaku Gothic ProN\", \"ヒラギノ角ゴ ProN W3\""
YU_MINCHO = "YuMincho, \"游明朝\""
HIRAGINO_MINCHO = "\"Hiragino Mincho ProN\", \"ヒラギノ明朝 ProN W3\""
MEIRYO = "Meiryo, \"メイリオ\""
YU_MINCHO = "YuMincho, \"游明朝\""
YU_GOTHIC = "YuGothic, \"游ゴシック\""

module.exports =
  pixelRatio: 1

  meta:
    slug: "peraichi"
    title: "ページタイトル"
    keywords: "キーワード"
    description: "ディスクリプション"
    url: "http://example.org/"
    ogImage: "http://example.org/img/ogp.jpg"

  font:
    gothic: "#{YU_GOTHIC}, #{HIRAGINO_GOTHIC}, #{MEIRYO}, sans-serif"
    mincho: "#{YU_MINCHO}, #{HIRAGINO_MINCHO}, #{MEIRYO}, sans-serif"
  
  layout:
    width: 960
