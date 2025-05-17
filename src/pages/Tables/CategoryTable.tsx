import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoriesTable from "../../components/tables/CategoryTable/CategoriesTable";

export default function CategoryTable() {
  return (
    <>
      <PageMeta
        title="Category Tables Dashboard | boltecpros"
        description="This is the Category list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Category List" />
      <div className="space-y-6">
        <ComponentCard
          title=""
          addUnit="Add Category"
          route="/manage-category"
        >
          <CategoriesTable />
        </ComponentCard>
      </div>
    </>
  );
}
