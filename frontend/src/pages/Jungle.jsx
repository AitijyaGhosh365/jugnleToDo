import React, { useEffect, useState } from "react";
import "../css/Jungle.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { generateMapStructure, drawMap } from '../services/JungleFunction';

function Jungle() {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const mapData = localStorage.getItem('mapData');
        const nonWaterTiles = localStorage.getItem('nonWaterTiles');
        
        if (!mapData || !nonWaterTiles) {
            generateMapdata_and_nonWaterTiles();
        }
        drawJungle();
    }, []);

    const calculateGenFactor = () => {
        const savedTasks = localStorage.getItem('task-list');
        let genFactor = 0;

        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                genFactor = parsedTasks.reduce((count, task) => {
                    return task.status ? count + 1 : count;
                }, 0) / parsedTasks.length;
            } catch (error) {
                console.error('Error parsing tasks from localStorage:', error);
            }
        }
        localStorage.setItem('genFactor', genFactor.toString());
        return genFactor;
    }

    const drawJungle = async () => {
        const genFactor = calculateGenFactor();
        let mapData = JSON.parse(localStorage.getItem('mapData') || 'null');
        let nonWaterTiles = JSON.parse(localStorage.getItem('nonWaterTiles') || 'null');

        if (!mapData || !nonWaterTiles) {
            generateMapdata_and_nonWaterTiles();
            mapData = JSON.parse(localStorage.getItem('mapData'));
            nonWaterTiles = JSON.parse(localStorage.getItem('nonWaterTiles'));
        }

        const imageUrl = await drawMap(genFactor, mapData, nonWaterTiles);
        if (imageUrl) {
            setImageSrc(imageUrl);
        }
    }

    const generateMapdata_and_nonWaterTiles = () => {
        const response = generateMapStructure();
        localStorage.setItem('mapData', JSON.stringify(response.map_data));
        localStorage.setItem('nonWaterTiles', JSON.stringify(response.non_water_tiles));
    }

    const handleDownload = () => {
        if (!imageSrc) return;
        const now = new Date();
        const dateTimeString = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `jungle-map_${dateTimeString}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="jungle-wrapper">
            <TransformWrapper initialScale={0.8} minScale={0.3} maxScale={3} wheel={{ step: 0.1 }} doubleClick={{ disabled: true }}>
                {({ resetTransform }) => (
                    <>
                        <TransformComponent wrapperClass="jungle-image-container" contentClass="jungle-image-content">
                            {imageSrc && (
                                <img src={imageSrc} className="map-image" alt="Generated Map" />
                            )}
                        </TransformComponent>

                        <div className="controls-bottom">
                            <button className="reset-interaction" title="Reset Map" onClick={() => { generateMapdata_and_nonWaterTiles(); drawJungle(); }}>
                                <svg fill="currentColor" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0" fillRule="evenodd"></path> </g></svg>
                            </button>
                            <button className="download-interaction" title="Download Image" onClick={handleDownload}>
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                            </button>
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default Jungle;
