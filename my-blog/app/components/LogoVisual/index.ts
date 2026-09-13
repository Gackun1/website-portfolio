/**
 * ロゴの MV ビジュアル 3 種
 * いずれも position: relative / absolute な親の中に置くだけで、親いっぱいに描画される。
 *
 *   import { ParticleLogo, PathLogo, PathLogoPlus } from "@/app/components/LogoVisual";
 *   <ParticleLogo />             WebGL パーティクル版 (現行)
 *   <PathLogoPlus />             パス描画のブラッシュアップ版
 *   <PathLogo />                 初期のパス描画版
 *   <... dust={false} />         背景の塵パーティクルを消す (デフォルトは表示)
 */
export { default as ParticleLogo } from "./ParticleLogo";
export { default as PathLogo } from "./PathLogo";
export { default as PathLogoPlus } from "./PathLogoPlus";
export { default as DustField } from "./DustField";
