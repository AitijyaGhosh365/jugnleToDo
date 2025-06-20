import React, { useState, useEffect, useCallback, useRef } from 'react';
import TaskDiv from '../components/Task';
import TaskInteractions from '../components/ToDoTaskInteractions';

const ToDo = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("task-list");
        return savedTasks ? JSON.parse(savedTasks) : [

        ];
    });

    const [openTaskId, setOpenTaskId] = useState(null);
    const globalZIndex = useRef(3); // Start from 3 since we have 2 initial tasks

    // Normalize z-indexes to keep them efficient (0-based sequential)
    const normalizeZIndexes = useCallback(() => {
        setTasks(prevTasks => {
            // Sort tasks by current zIndex
            const sortedTasks = [...prevTasks].sort((a, b) => a.zIndex - b.zIndex);
            
            // Reassign sequential z-indexes starting from 1
            const normalizedTasks = sortedTasks.map((task, index) => ({
                ...task,
                zIndex: index + 1
            }));
            
            // Reset global counter to the next available index
            globalZIndex.current = normalizedTasks.length + 1;
            
            // Save to localStorage
            localStorage.setItem("task-list", JSON.stringify(normalizedTasks));
            
            return normalizedTasks;
        });
    }, []);

    // Bring task to front when interacted with
    const bringTaskToFront = useCallback((taskId) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === taskId 
                    ? { ...task, zIndex: globalZIndex.current++ }
                    : task
            );
            
            localStorage.setItem("task-list", JSON.stringify(updatedTasks));
            
            // Normalize z-indexes if global counter gets too high (every 100 interactions)
            if (globalZIndex.current > 100) {
                setTimeout(normalizeZIndexes, 0);
            }
            
            return updatedTasks;
        });
    }, [normalizeZIndexes]);

    // Add a new task and open its modal
    const addNewTask = useCallback(() => {
        setTasks(prevTasks => {
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate center position
            const centerX = viewportWidth / 2 ;
            const centerY = viewportHeight / 2 ;
            
            // Add random offset (±50px)
            const randomOffsetX = Math.floor(Math.random() * 100) - 50;
            const randomOffsetY = Math.floor(Math.random() * 100) - 50;
            
            const newTask = {
                id: Date.now(),
                title: `New Task`,
                description: "",
                status: false,
                x: centerX + randomOffsetX,
                y: centerY + randomOffsetY,
                zIndex: globalZIndex.current++
            };
            
            const updatedTasks = [...prevTasks, newTask];
            localStorage.setItem("task-list", JSON.stringify(updatedTasks));
            setOpenTaskId(newTask.id);
            return updatedTasks;
        });
    }, []);

    // Delete all tasks
    const deleteAllTasks = useCallback(() => {
        localStorage.removeItem("task-list");
        setTasks([]);
        setOpenTaskId(null);
        globalZIndex.current = 1; // Reset global counter
    }, []);

    // Delete a specific task
    const deleteTask = useCallback((taskId) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.filter(task => task.id !== taskId);
            localStorage.setItem("task-list", JSON.stringify(updatedTasks));
            
            // If the deleted task was open, close its modal
            if (openTaskId === taskId) {
                setOpenTaskId(null);
            }
            
            // Normalize z-indexes after deletion
            setTimeout(normalizeZIndexes, 0);
            
            return updatedTasks;
        });
    }, [openTaskId, normalizeZIndexes]);

    // Delete only completed tasks
    const deleteCompletedTasks = useCallback(() => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.filter(task => !task.status);
            localStorage.setItem("task-list", JSON.stringify(updatedTasks));
            
            // If the open task was deleted, close its modal
            if (openTaskId && !updatedTasks.some(task => task.id === openTaskId)) {
                setOpenTaskId(null);
            }
            
            // Normalize z-indexes after deletion
            setTimeout(normalizeZIndexes, 0);
            
            return updatedTasks;
        });
    }, [openTaskId, normalizeZIndexes]);

    // Update a task
    const updateTask = useCallback((taskId, updates) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
            );

            localStorage.setItem("task-list", JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    }, []);

    // Close modal
    const closeModal = useCallback(() => {
        setOpenTaskId(null);
    }, []);

    // Handle task interaction (clicking or dragging)
    const handleTaskInteraction = useCallback((taskId) => {
        bringTaskToFront(taskId);
    }, [bringTaskToFront]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <TaskInteractions 
                addNewTask={addNewTask}
                deleteAllTasks={deleteAllTasks}
                deleteCompletedTasks={deleteCompletedTasks}
            />
            
            {tasks.map(task => (
                <TaskDiv
                    key={task.id}
                    task={task}
                    onUpdateTask={updateTask}
                    onTaskInteraction={handleTaskInteraction}
                    onDeleteTask={deleteTask}
                    isModalOpen={task.id === openTaskId}
                    onOpenModal={() => setOpenTaskId(task.id)}
                    onCloseModal={closeModal}
                />
            ))}


        </div>
    );
};

export default ToDo;