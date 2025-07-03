import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoutesLayout from "./navigation/protectedRoutes";
import UnProtectedRoutesLayout from "./navigation/unProtectedRoutes";
import UserTables from "./pages/Tables/UserTables";
import UserDetails from "./pages/UserDetails";
import { AddUserForm } from "./pages/Forms/addUserForm";
import CategoryTable from "./pages/Tables/CategoryTable";
import AddOrEditCategoryPage from "./pages/Forms/Category/AddOrEditCategoryPage";
import ViewCategoryPage from "./pages/Forms/Category/ViewCategoryPage";
import TaskTable from "./pages/Tables/TaskTables";
import AddOrEditTaskPage from "./pages/Forms/Task/AddOrEditTaskPage";
import ViewTaskPage from "./pages/Forms/Task/ViewTaskPage";
import TaskStepsPage from "./pages/processes/TaskStepsPage";
import QuestionnaiyTable from "./pages/Tables/QuestionnairesTable";
import AddOrEditQuestionnairesPage from "./pages/Forms/Questionnaires/AddorEditQuestionnairesPage";
import ViewQuestionnairesPage from "./pages/Forms/Questionnaires/ViewQuestionnaires";
import ProcessTemplatesTable from "./pages/Tables/ProcessTemplatesTable";
import AddOrEditProcessTemplatPage from "./pages/Forms/ProcessTemplate/AddOrEditProcessTemplatePage";
import ViewProcessTemplatPage from "./pages/Forms/ProcessTemplate/ViewProcessTemplatePage";
import DocumentType from "./pages/Tables/DocumentType";
import AddOrEditDocumentType from "./pages/Forms/DocumentTypes/AddOrEditDocumentType";
import Questions from "./pages/Tables/Questions";
import AddOrEditQuestionPage from "./pages/Forms/Questions/AddOrEditQuestionPage";
import ViewQuestionPage from "./pages/Forms/Questions/ViewQuestionPage";
import ViewDocumentTypePage from "./pages/Forms/DocumentTypes/ViewDocumentTypePage";
import ViewTaskTemplatPage from "./pages/Forms/TaskTemplates/ViewTaskTemplatePage";
import TaskTemplatesTable from "./pages/Tables/TaskTemplateTable";
import AddOrEditTaskTemplatPage from "./pages/Forms/TaskTemplates/AddOrEditTaskTemplate";
import HotTaskTemplatesTable from "./pages/Tables/HotTaskTemplateTable";
import HotViewTaskTemplatPage from "./pages/Forms/HotTaskTemplates/HotViewTaskTemplatePage";
import AddOrEditHotTaskTemplate from "./pages/Forms/HotTaskTemplates/AddOrEditHotTaskTemplate";
import BannerImages from "./pages/Tables/BannerImages";
import NotificationTexts from "./pages/Tables/NotificationTexts";
import Steps from "./pages/Tables/Steps";
import AddOrEditSteps from "./pages/Forms/Steps/AddOrEditSteps";
import ViewSteps from "./pages/Forms/Steps/ViewSteps";
import AddOrEditBanner from "./pages/Forms/BannerImages/AddOrEditBanner";
import ViewBannerImage from "./pages/Forms/BannerImages/ViewBannerImage";
import AddOrEditNotificationText from "./pages/Forms/NotificationText/AddOrEditNotificationText";
import ViewNotificationText from "./pages/Forms/NotificationText/ViewNotificationText";
import ProceduresTable from "./pages/Tables/Procedures";
import AddOrEditProcedure from "./pages/Forms/Procedure/AddOrEditProcedure";
import ViewProcedurePage from "./pages/Forms/Procedure/ViewProcedurePage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <ProtectedRoutesLayout>
                  <Home />
                </ProtectedRoutesLayout>
              }
            />

            {/* Others Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoutesLayout>
                  <UserProfiles />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoutesLayout>
                  <Calendar />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/blank"
              element={
                <ProtectedRoutesLayout>
                  <Blank />
                </ProtectedRoutesLayout>
              }
            />

            {/* Forms */}
            <Route
              path="/form-elements"
              element={
                <ProtectedRoutesLayout>
                  <FormElements />
                </ProtectedRoutesLayout>
              }
            />

            {/* Tables */}
            <Route
              path="/basic-tables"
              element={
                <ProtectedRoutesLayout>
                  <BasicTables />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/user-list"
              element={
                <ProtectedRoutesLayout>
                  <UserTables />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/user-details/:id"
              element={
                <ProtectedRoutesLayout>
                  <UserDetails />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/add-user"
              element={
                <ProtectedRoutesLayout>
                  <AddUserForm />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/category-list"
              element={
                <ProtectedRoutesLayout>
                  <CategoryTable />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-category"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditCategoryPage />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-category/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditCategoryPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/categories/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewCategoryPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/task-list"
              element={
                <ProtectedRoutesLayout>
                  <TaskTable />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-task"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditTaskPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-task/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditTaskPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/tasks/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewTaskPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/tasks/steps/:id"
              element={
                <ProtectedRoutesLayout>
                  <TaskStepsPage />
                </ProtectedRoutesLayout>
              }
            />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Questionnaires */}
            <Route
              path="/questionnaires-list"
              element={
                <ProtectedRoutesLayout>
                  <QuestionnaiyTable />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-questionnaires"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditQuestionnairesPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-questionnaires/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditQuestionnairesPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/questionnaires/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewQuestionnairesPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/process-templates-list"
              element={
                <ProtectedRoutesLayout>
                  <ProcessTemplatesTable />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-process-templates"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditProcessTemplatPage />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-process-templates/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditProcessTemplatPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/process-templates/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewProcessTemplatPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/document-type-list"
              element={
                <ProtectedRoutesLayout>
                  <DocumentType />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/banner-images"
              element={
                <ProtectedRoutesLayout>
                  <BannerImages />
                </ProtectedRoutesLayout>
              }
            />
            <Route path="/add-banner-image" element={<AddOrEditBanner />} />
            <Route
              path="/edit-banner-image/:id"
              element={<AddOrEditBanner />}
            />
            <Route
              path="/view-banner-image/:id"
              element={<ViewBannerImage />}
            />

            <Route
              path="/notification-texts"
              element={
                <ProtectedRoutesLayout>
                  <NotificationTexts />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/add-notification-text"
              element={<AddOrEditNotificationText />}
            />
            <Route
              path="/edit-notification-text/:id"
              element={<AddOrEditNotificationText />}
            />
            <Route
              path="/view-notification-text/:id"
              element={<ViewNotificationText />}
            />

            <Route
              path="/steps-list"
              element={
                <ProtectedRoutesLayout>
                  <Steps />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-steps/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditSteps />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/view-step/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewSteps />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/edit-step/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditSteps />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/add-step/"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditSteps />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/document-type/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewDocumentTypePage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-document-type"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditDocumentType />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-document-type/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditDocumentType />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/questions-list"
              element={
                <ProtectedRoutesLayout>
                  <Questions />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/question/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewQuestionPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-question"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditQuestionPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-question/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditQuestionPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/task-templates/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <ViewTaskTemplatPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/task-templates-list"
              element={
                <ProtectedRoutesLayout>
                  <TaskTemplatesTable />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-task-templates"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditTaskTemplatPage />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-task-templates/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditTaskTemplatPage />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/hot-task-list"
              element={
                <ProtectedRoutesLayout>
                  <HotTaskTemplatesTable />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/manage-hot-task-templates"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditHotTaskTemplate />
                </ProtectedRoutesLayout>
              }
            />
            <Route
              path="/manage-hot-task-templates/:id"
              element={
                <ProtectedRoutesLayout>
                  <AddOrEditHotTaskTemplate />
                </ProtectedRoutesLayout>
              }
            />

            <Route
              path="/Procedures"
              element={
                <ProtectedRoutesLayout>
                  <ProceduresTable />
                </ProtectedRoutesLayout>
              }
            />
            <Route path="/procedures-list" element={<ProceduresTable />} />
            <Route path="/manage-procedure" element={<AddOrEditProcedure />} />
            <Route
              path="/manage-procedure/:id"
              element={<AddOrEditProcedure />}
            />
            <Route
              path="/procedures/view/:id"
              element={<ViewProcedurePage />}
            />
            <Route
              path="/hot-task-templates/view/:id"
              element={
                <ProtectedRoutesLayout>
                  <HotViewTaskTemplatPage />
                </ProtectedRoutesLayout>
              }
            />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={
              <UnProtectedRoutesLayout>
                <SignIn />
              </UnProtectedRoutesLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <UnProtectedRoutesLayout>
                <SignUp />
              </UnProtectedRoutesLayout>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
