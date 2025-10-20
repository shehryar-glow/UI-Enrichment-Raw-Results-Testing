import "../css/Option1.css";

function Option1({ data }) {
  if (!data) return <div className="content">Loading...</div>;

  return (
    <div className="content">
      <div className="option1-title">Raw Data</div>
      <pre className="option1-json-display">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Option1;
