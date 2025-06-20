import React, { useState, useEffect, useCallback } from 'react';

const TaskDiv = ({ task, onUpdateTask, onTaskInteraction, onDeleteTask, isModalOpen, onOpenModal, onCloseModal }) => {
    const [position, setPosition] = useState({ x: task.x, y: task.y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false);
    const [isChecked, setIsChecked] = useState(task.status);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    // Debounced autosave function
    const debouncedSave = useCallback(() => {
        // console.log("Hi")
        const timeoutId = setTimeout(() => {
            onUpdateTask(task.id, {
                title,
                description,
                status: isChecked,
                x: position.x,
                y: position.y,
                zIndex: task.zIndex // Preserve z-index
            });
        }, 100); // 100ms delay

        return () => clearTimeout(timeoutId);
    }, [task.id, task.zIndex, title, description, isChecked, position, onUpdateTask]);

    // Auto-save when any field changes
    useEffect(() => {
        const cleanup = debouncedSave();
        return cleanup;
    }, [title, description, isChecked, position.x, position.y]);

    // Get coordinates from either mouse or touch event
    const getEventCoords = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e) => {
        // Don't start dragging if clicking/touching on checkbox
        if (e.target.type === 'checkbox') {
            return;
        }

        // Bring task to front when interaction starts
        onTaskInteraction(task.id);

        const coords = getEventCoords(e);
        setIsDragging(true);
        setHasDragged(false); // Reset drag flag
        setDragStart({
            x: coords.x - position.x,
            y: coords.y - position.y
        });
        e.preventDefault();
    };

    const handleMove = (e) => {
        if (isDragging) {
            const coords = getEventCoords(e);
            setHasDragged(true); // Mark that we've actually dragged
            setPosition({
                x: coords.x - dragStart.x,
                y: coords.y - dragStart.y
            });
            e.preventDefault(); // Prevent scrolling on touch devices
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        // Reset hasDragged after a short delay to allow click handler to check it
        setTimeout(() => setHasDragged(false), 100);
    };

    const handleDivClick = (e) => {
        // Don't open modal if:
        // 1. Clicking on checkbox
        // 2. We just finished dragging
        if (e.target.type === 'checkbox' || hasDragged) {
            return;
        }

        // Bring task to front when clicked
        onTaskInteraction(task.id);
        onOpenModal();
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation(); // Prevent event bubbling to div
        setIsChecked(e.target.checked);
        // Bring task to front when checkbox is interacted with
        onTaskInteraction(task.id);
    };

    // Add event listeners to document for mouse/touch move and end
    useEffect(() => {
        if (isDragging) {
            // Mouse events
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // Touch events
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            // Mouse events
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);

            // Touch events
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, dragStart, position]);

    return (
        <>
            <div
    className={`
        fixed w-70 p-1 rounded-2xl border-[4px] group
        ${!isChecked ? `border-[#99A0F8] bg-[#FEEFFF] text-[#11451D]` : `border-[#99CD88] bg-[#F7FFF0] text-[#587C60] opacity-80`}
        hover:scale-[1.02] hover:shadow-3xl transition-transform transition-shadow duration-200 ease-out
        active: select-none touch-none
        ${isDragging ? 'cursor-grabbing shadow-3xl scale-[1.02]' : 'cursor-pointer'}
    `}
    style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 999 : task.zIndex,
    }}
    onMouseDown={handleStart}
    onTouchStart={handleStart}
    onClick={handleDivClick}
>

    <button
    className="
        absolute -right-3 -top-3 w-7 h-7 border-2 border-red-500 rounded-full cursor-pointer
        bg-red-100 flex items-center justify-center text-2xl text-red-500 
        hover:bg-red-200 hover:text-red-700 hover:scale-[1.05] 
        opacity-0 scale-90 
        group-hover:opacity-100 group-hover:scale-100 
        transition-all duration-200 ease-out

    "
    onClick={() => onDeleteTask(task.id)}
>
    ×
</button>
                
                <div className=" text-center">
                    <div className="checkbox-container flex items-center px-3 gap-3 ">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 cursor-pointer accent-pink-500 rounded"
                        />
                        <label
                            onClick={handleDivClick}
                            className="text-[18px] font-semibold cursor-pointer select-none"
                        >
                            {title}
                        </label>

                    </div>


                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center animate-in fade-in duration-300"
                    style={{ zIndex: 1000 }} // Modal always on top
                    onClick={onCloseModal}
                >
                    <div
                        className="bg-white 
                        border-5 border-[#99A0F8] rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-auto shadow-2xl animate-in slide-in-from-bottom-8 zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                onClick={(e) => e.stopPropagation()}
                                className="w-7 h-7 cursor-pointer accent-pink-500 rounded hover:scale-[1.05]"
                            />
                            <input
                                type="text"
                                value={title}
                                placeholder='Task'
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-2xl w-full text-center font-semibold text-gray-800 border-2 border-[#99A0F8] mx-3 rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-[#99A0F8]"
                            />
                            <button
                                className="cursor-pointer w-10 h-8 border-2 border-red-500 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-2xl text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-[1.05]"
                                onClick={() => onDeleteTask(task.id)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6 pt-4 ">
                            <textarea
                                value={description}
                                placeholder='Description...'
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-[250px] text-gray-700 text-lg leading-relaxed mb-4 border-2 border-[#99A0F8]  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#99A0F8] resize-y"
                                style={{
                                    resize: 'vertical',
                                    overflow: 'auto', // allow scrolling
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE/Edge
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskDiv;
