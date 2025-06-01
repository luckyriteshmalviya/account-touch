import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TaskTemplatTable from "../../components/tables/TaskTemplateTable/TaskTemplateTable";

export default function TaskTemplatesTable() {
  return (
    <>
      <PageMeta
        title="Task Templates List Dashboard | boltecpros"
        description="This is the Task Templates list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Task Templates List" />
      <div className="space-y-6">
        <ComponentCard
          title=""
          addUnit="Add TaskTemplates"
          route="/manage-task-templates"
        >
          <TaskTemplatTable />
        </ComponentCard>
      </div>
    </>
  );
}
