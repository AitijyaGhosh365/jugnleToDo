import '../css/TaskInteractions.css';
import { useCallback, useEffect } from 'react';

const TaskInteractions = ({ addNewTask, deleteAllTasks, deleteCompletedTasks }) => {
    // Keyboard event handler
    const handleKeyDown = useCallback((e) => {
        // Ctrl+Alt+N (or Cmd+Alt+N on Mac) for new task
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
            e.preventDefault();
            addNewTask();
        }
        
        // Ctrl+Alt+D (or Cmd+Alt+D on Mac) for delete all
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'd') {
            e.preventDefault();
            deleteAllTasks();
        }
        
        // Ctrl+Alt+C (or Cmd+Alt+C on Mac) for delete completed
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'c') {
            e.preventDefault();
            deleteCompletedTasks();
        }
    }, [addNewTask, deleteAllTasks, deleteCompletedTasks]);

    // Add event listener when component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="interaction-btns">
            <button onClick={addNewTask} aria-label="Add New Task" className='add-task-interaction' title='Add New Task (Ctrl + Alt + N)'>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="currentColor"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>

            <button onClick={deleteAllTasks} aria-label="Delete All Tasks" className='delete-all-task-interaction' title='Delete All Task (Ctrl + Alt + D)'>
                <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_6_"> <g id="XMLID_11_"> <path d="M240,121.076H30V275c0,8.284,6.716,15,15,15h60h37.596c19.246,24.348,49.031,40,82.404,40c57.897,0,105-47.103,105-105 C330,172.195,290.816,128.377,240,121.076z M225,300c-41.355,0-75-33.645-75-75s33.645-75,75-75s75,33.645,75,75 S266.355,300,225,300z"></path> </g> <g id="XMLID_18_"> <path d="M240,90h15c8.284,0,15-6.716,15-15s-6.716-15-15-15h-30h-15V15c0-8.284-6.716-15-15-15H75c-8.284,0-15,6.716-15,15v45H45 H15C6.716,60,0,66.716,0,75s6.716,15,15,15h15H240z M90,30h90v30h-15h-60H90V30z"></path> </g> <g id="XMLID_23_"> <path d="M256.819,193.181c-5.857-5.858-15.355-5.858-21.213,0L225,203.787l-10.606-10.606c-5.857-5.858-15.355-5.858-21.213,0 c-5.858,5.858-5.858,15.355,0,21.213L203.787,225l-10.606,10.606c-5.858,5.858-5.858,15.355,0,21.213 c2.929,2.929,6.768,4.394,10.606,4.394c3.839,0,7.678-1.465,10.607-4.394L225,246.213l10.606,10.606 c2.929,2.929,6.768,4.394,10.607,4.394c3.839,0,7.678-1.465,10.606-4.394c5.858-5.858,5.858-15.355,0-21.213L246.213,225 l10.606-10.606C262.678,208.535,262.678,199.039,256.819,193.181z"></path> </g> </g> </g></svg>
            </button>

            <button onClick={deleteCompletedTasks} aria-label="Delete Completed Tasks" className='delete-completed-task-interaction'  title='Delete Completed Task (Ctrl + Alt + C)'>
                <svg id='dcti-tick' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <svg id='dcti-trash' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
        </div>
    );
};

export default TaskInteractions;