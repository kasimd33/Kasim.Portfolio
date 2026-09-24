export default function SceneLoader({ loading = false }) {
  return <div className="scene-fallback"><div className="fallback-orbit orbit-one" /><div className="fallback-orbit orbit-two" /><div className="fallback-orbit orbit-three" />{loading && <span className="scene-loading">Loading experience<span>...</span></span>}</div>;
}
