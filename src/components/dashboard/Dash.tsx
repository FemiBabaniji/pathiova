// src/components/Dashboard.tsx

const Dashboard = () => {
    return (
      <div className="flex-1 bg-gradient-to-r from-orange-50 to-orange-100 p-10">
        <h2 className="text-3xl font-bold mb-6">Language Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src="/images/spain.png" alt="Spanish" className="mx-auto mb-4" />
            <p className="text-lg font-semibold">Spanish</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src="/images/france.png" alt="French" className="mx-auto mb-4" />
            <p className="text-lg font-semibold">French</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src="/images/germany.png" alt="German" className="mx-auto mb-4" />
            <p className="text-lg font-semibold">German</p>
          </div>
          {/* Add more courses as needed */}
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  