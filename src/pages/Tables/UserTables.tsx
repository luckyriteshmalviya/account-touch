import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTableOne from "../../components/tables/BasicTables/UserTable";

export default function UserTables() {
  return (
    <>
      <PageMeta
        title="User Tables Dashboard | boltecpros"
        description="This is User list Basic Tables Dashboard page for boltecpros."
      />
      <PageBreadcrumb pageTitle="User List" />
      <div className="space-y-6">
        <ComponentCard
          title="User List"
          addUnit="Add User"
          route="/add-user"
        >
          <UserTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
