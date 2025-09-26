import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  type, 
  statusFilter, 
  priorityFilter, 
  onStatusChange, 
  onPriorityChange, 
  onClearFilters,
  searchQuery,
  onSearchChange 
}) => {
  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all" || searchQuery;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {type === "tasks" && (
            <>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>

              <Select
                value={priorityFilter}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <ApperIcon name="X" size={14} />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;