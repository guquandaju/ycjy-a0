import LOGIN from '../pages/login.jsx';
import VILLAGEDASHBOARD from '../pages/villageDashboard.jsx';
import COUNTYDASHBOARD from '../pages/countyDashboard.jsx';
import PATIENTREGISTRATION from '../pages/patientRegistration.jsx';
import TESTREGISTRATION from '../pages/testRegistration.jsx';
import TESTRESULTS from '../pages/testResults.jsx';
import PATIENTDETAIL from '../pages/patientDetail.jsx';
import TESTTASKDETAIL from '../pages/testTaskDetail.jsx';
import COUNTYTESTDETAIL from '../pages/countyTestDetail.jsx';
import RESULTENTRY from '../pages/resultEntry.jsx';
export const routers = [{
  id: "login",
  component: LOGIN
}, {
  id: "villageDashboard",
  component: VILLAGEDASHBOARD
}, {
  id: "countyDashboard",
  component: COUNTYDASHBOARD
}, {
  id: "patientRegistration",
  component: PATIENTREGISTRATION
}, {
  id: "testRegistration",
  component: TESTREGISTRATION
}, {
  id: "testResults",
  component: TESTRESULTS
}, {
  id: "patientDetail",
  component: PATIENTDETAIL
}, {
  id: "testTaskDetail",
  component: TESTTASKDETAIL
}, {
  id: "countyTestDetail",
  component: COUNTYTESTDETAIL
}, {
  id: "resultEntry",
  component: RESULTENTRY
}]