import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProcessTemplatTable from "../../components/tables/ProcessTemplateTable/ProcessTemplateTable";

export default function ProcessTemplatesTable() {
  return (
    <>
      <PageMeta
        title="ProcessTemplates Tables Dashboard | boltecpros"
        description="This is the ProcessTemplates list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="ProcessTemplates Table" />
      <div className="space-y-6">
        <ComponentCard
          title="ProcessTemplates Table"
          addUnit="Add ProcessTemplates"
          route="/manage-process-templates"
        >
          <ProcessTemplatTable />
        </ComponentCard>
      </div>
    </>
  );
}
