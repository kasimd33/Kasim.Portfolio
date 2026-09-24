import '@/styles/loader.css';

// The supplied eight-box assembly animation, scoped to avoid global style collisions.
export default function Loader() {
  return <div className="box-loader" aria-hidden="true">
    {Array.from({ length: 8 }, (_, index) => <div key={index} className={`box box${index}`}><div /></div>)}
    <div className="ground"><div /></div>
  </div>;
}
