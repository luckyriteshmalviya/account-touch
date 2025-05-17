import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import QuestionnairesTable from "../../components/tables/Questionnaires/QuestionnairesTable";

export default function QuestionnaiyTable() {
  return (
    <>
      <PageMeta
        title="Questionnaires Tables Dashboard | boltecpros"
        description="This is the Questionnaires list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Questionnaires List" />
      <div className="space-y-6">
        <ComponentCard
          title=""
          addUnit="Add Questionnaires"
          route="/manage-questionnaires"
        >
          <QuestionnairesTable />
        </ComponentCard>
      </div>
    </>
  );
}
