
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OverviewSection from "./OverviewSection";
import FinancialAnalysis from "./FinancialAnalysis";
import ReportsAndAlerts from "./ReportsAndAlerts";
import DonutAndEntries from "./DonutAndEntries";
import LineAndBarEmission from "./LineAndBarEmission";
import SinkGraphs from "./SinkGraphs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);



function DashBoard() {
 
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      <Navbar className="mb-2 pt-4" />

      {/* Dashboard Grid Layout */}
      <div className="px-10">
        <OverviewSection />
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
       <DonutAndEntries />

          {/* Tabs */}
          <div className="flex flex-wrap gap-8 p-1 justify-between xl:col-span-3">
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Electricity</h2>
            <p className="text-3xl font-semibold mb-2">60 MWh</p>
            <p className="text-red-500">+15% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Explosion</h2>
            <p className="text-3xl font-semibold mb-2">40 tCO2e</p>
            <p className="text-green-500">-5% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Fuel</h2>
            <p className="text-3xl font-semibold mb-2">50 tCO2e</p>
            <p className="text-red-500">+10% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Shipping</h2>
            <p className="text-3xl font-semibold mb-2">35 tCO2e</p>
            <p className="text-green-500">-8% from last week</p>
          </div>
        </div>

       
{/* Emission Line and Bar Chart Below Doughnut and Data Entries */}

<LineAndBarEmission />
<SinkGraphs />

        <div className="flex flex-col xl:flex-row gap-8 xl:col-span-3 p-4">
    <FinancialAnalysis />
    <ReportsAndAlerts />
</div>


      </div>
      <Footer className="w-full bg-gray-800 text-white py-4 text-center" />
    </div>
  );
}

export default DashBoard;
