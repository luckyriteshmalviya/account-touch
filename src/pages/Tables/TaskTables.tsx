import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TasksTable from "../../components/tables/TaskTable/TaskTable";

export default function TaskTable() {
  return (
    <>
      <PageMeta
        title="Task Tables Dashboard | boltecpros"
        description="This is the Task list table page for boltecpros."
      />
      <PageBreadcrumb pageTitle="Task List" />
      <div className="space-y-6">
        <ComponentCard
          // title="Task List"
          addUnit="Add Task"
          route="/manage-task"
        >
          <TasksTable />
        </ComponentCard>
      </div>
    </>
  );
}
