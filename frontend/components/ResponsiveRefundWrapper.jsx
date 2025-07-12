import React from 'react';

const ResponsiveRefundWrapper = ({ children, title = "Refund Orders", description }) => {
  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 pt-1 refund-page-container">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
            {title}
          </h3>
          {description && (
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>
        
        <div className="data-grid-container overflow-hidden">
          <div className="w-full overflow-x-auto table-responsive">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveRefundWrapper;
