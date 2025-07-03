import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProcedureDetailsService } from "../../../services/restApi/Procedure";
// import { getProcedureDetailsService } from "../../../services/restApi/procedure";

export default function ViewProcedurePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [proc, setProc] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getProcedureDetailsService(id);
        setProc(data);
      }
    })();
  }, [id]);

  if (!proc) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <p className="">
        {" "}
        <strong>Title:</strong> {proc.title}
      </p>
      <p>
        <strong>Description:</strong> {proc.description || "-"}
      </p>
      <div>
        <strong>Steps:</strong>
        {proc.steps?.length ? (
          <ol className="pl-4 list-decimal">
            {proc.steps.map((s: any, i: number) => (
              <li key={i} className="mb-2">
                <strong>{s.step_text}</strong>
                {s.description && (
                  <p className="text-gray-600">{s.description}</p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p>No steps added.</p>
        )}
      </div>
      <button
        onClick={() => navigate("/manage-procedure/" + id)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Edit Procedure
      </button>
    </div>
  );
}
