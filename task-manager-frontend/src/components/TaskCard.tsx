import { Task } from "../api";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import "../styles/TaskCard.css";
import { formatRelativeTime } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";


interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}
const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p className="description">{task.description}</p>
      <p className="due-date">{formatRelativeTime(task.due_date)}</p>
      <div className="task-footer">
        <span className={`priority ${task.priority}`}>{task.priority}</span>
        <div className="icons">
          <FaStar className="icon star" />
          <FaEdit className="icon edit" onClick={() => navigate(`/tasks/edit/${task.id}`)} />
          <FaTrash className="icon delete" onClick={() => task.id !== undefined && onDelete(task.id)} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
