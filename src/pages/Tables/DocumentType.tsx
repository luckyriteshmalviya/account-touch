import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentTypeTable from "../../components/tables/DocumentTypeTable/DocumentTypeTable";

export default function DocumentType() {
  return (
    <>
      <PageMeta
        title="Document List"
        description="This is the Category list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Document Type Table" />
      <div className="space-y-6">
        <ComponentCard
          title=""
          addUnit="Add Document Type"
          route="/manage-document-type"
        >
          <DocumentTypeTable />
        </ComponentCard>
      </div>
    </>
  );
}
