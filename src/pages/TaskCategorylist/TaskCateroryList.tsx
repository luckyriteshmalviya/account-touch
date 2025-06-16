import TasksByCategory from "./TasksByCategory";
import TasksDueInWeek from "./TasksDueInWeek";

const TaskCategoryList = () => {
  return (
    <>
      {" "}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <TasksByCategory />
        </div>
        <div className="w-full md:w-1/2">
          <TasksDueInWeek />
        </div>
      </div>
    </>
  );
};

export default TaskCategoryList;
