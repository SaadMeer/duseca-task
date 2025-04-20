import React from 'react';

const DashboardBox = ({ icon, title, subtitle, onClick, iconColor }) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition"
        >
            <div className={`text-4xl ${iconColor}`}>{icon}</div>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
};

export default DashboardBox;
