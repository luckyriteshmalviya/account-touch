import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import QuestionsTable from "../../components/tables/QuestionsTable/QuestionsTable";

export default function Questions() {
  return (
    <>
      <PageMeta
        title="Questions Tables Dashboard | boltecpros"
        description="This is the Questions list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Questions List" />
      <div className="space-y-6">
        <ComponentCard title="" addUnit="Add Question" route="/manage-question">
          <QuestionsTable />
        </ComponentCard>
      </div>
    </>
  );
}
