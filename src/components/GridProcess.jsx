import React, { useState } from 'react';

export const GridProcess = ({ tableInfos, algorithm }) => {
    console.log({ tableInfos });

    const [currentColumn, setCurrentColumn] = useState(1);

    const handleNextColumn = () => {
        setCurrentColumn((prevColumn) => Math.min(prevColumn + 1, 11));
    };

    const handlePreviousColumn = () => {
        setCurrentColumn((prevColumn) => Math.max(prevColumn - 1, 1));
    };

    const handleFirstColumn = () => {
        setCurrentColumn(1);
    };
    
    const handleLastColumn = () => {
        setCurrentColumn(11);
    };

    const sortProcesses = (tableInfos) => {
        let sorted;
        if (algorithm === 'FIFO') {
            sorted = [...tableInfos].sort((a, b) => a.arrivalTime - b.arrivalTime);
        } else if (algorithm === 'SJF') {
            sorted = [...tableInfos].sort((a, b) => a.runningTime - b.runningTime);
        } else if (algorithm === 'PP' || algorithm === 'PNP') {
            sorted = [...tableInfos].sort((a, b) => a.priority - b.priority);
        }
        return sorted;
    };

    const sortedProcesses = sortProcesses(tableInfos);
    let lastEndTime = 0;

    return (
        <div className='grid-container'>
            <div className='process-grid' style={{ position: 'relative' }}>

                <div className="time-bar" style={{
                    position: 'absolute',
                    width: '10px',
                    height: '100%',
                    backgroundColor: 'yellow',
                    zIndex: 4,
                    top: 0,
                    bottom: 0,
                    gridColumnStart: currentColumn,
                    gridColumnEnd: currentColumn + 1,
                }}></div>

                {sortedProcesses.map((process, index) => {
                    const { arrivalTime, runningTime } = process;

                    const colStart = Math.max(lastEndTime, arrivalTime + 1); 
                    const colSpan = runningTime; 
                    lastEndTime = colStart + colSpan;
                    console.log({colStart});

                    const processStyle = {
                        gridColumnStart: colStart,
                        gridColumnEnd: `span ${colSpan}`,
                        position: 'relative',
                        gridRowStart: process.id,
                    };

                    return (
                        <div key={process.id} className='process' style={processStyle}>
                            <div style={{ zIndex: 2 }}>
                                {`P${process.id}`}
                            </div>
                        </div>
                    );
                })}

                {sortedProcesses.map((process) => {
                    const { arrivalTime } = process;

                    const arrivalStyle = {
                        gridColumnStart: arrivalTime + 1,
                        gridColumnEnd: arrivalTime + 2,
                        position: 'relative',
                        top: 0,
                        left: 0,
                        backgroundColor: '#CADEED',
                        width: '10px',
                        height: '100%',
                        gridRowStart: process.id,
                        zIndex: 1,
                    };

                    return (
                        <div key={`arrival-${process.id}`} className='arrival-indicator' style={arrivalStyle}></div>
                    );
                })}

                <div className="labels">
                    {[...Array(11)].map((_, i) => (
                        <div key={i} className="label">{i}</div>
                    ))}
                </div>

            </div>

            <div className='description-table'>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableInfos.map((process) => (
                            <tr key={process.id}>
                                <td className='p-4'>description {process.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="button-time-container">
                <button onClick={handleFirstColumn} className="button">{'<<'}</button>
                <button onClick={handlePreviousColumn} className="button">{'<'}</button>
                <button onClick={handleNextColumn} className="button">{'>'}</button>
                <button onClick={handleLastColumn} className="button">{'>>'}</button>
            </div>
        </div>
    );
};