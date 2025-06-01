import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import HotTaskTemplatTable from "../../components/tables/HotTaskTemplateTable/HotTaskTemplateTable";

export default function HotTaskTemplatesTable() {
  return (
    <>
      <PageMeta
        title="Hot Task Templates List  Dashboard | boltecpros"
        description="This is the TaskTemplates list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Hot Task Templates List" />
      <div className="space-y-6">
        <ComponentCard
          title=""
          addUnit="Add Hot TaskTemplates"
          route="/manage-hot-task-templates"
        >
          <HotTaskTemplatTable />
        </ComponentCard>
      </div>
    </>
  );
}
