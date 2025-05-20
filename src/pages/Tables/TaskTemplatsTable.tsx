import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TaskTemplatTable from "../../components/tables/TaskTemplatTable/TaskTemplatTable";

export default function TaskTemplatesTable() {
  return (
    <>
      <PageMeta
        title="TaskTemplates Tables Dashboard | boltecpros"
        description="This is the TaskTemplates list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="TaskTemplates Table" />
      <div className="space-y-6">
        <ComponentCard
          title="TaskTemplates Table"
          addUnit="Add TaskTemplates"
          route="/manage-task-templates"
        >
          <TaskTemplatTable />
        </ComponentCard>
      </div>
    </>
  );
}
