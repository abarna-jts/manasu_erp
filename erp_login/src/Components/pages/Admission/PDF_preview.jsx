import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setField, resetAll } from '../../../store/admissionSlice.js'; // adjust relative path

const PDF_preview = () => {
    const dispatch = useDispatch();
    const {
        referred_by,
        from_place,
        date_time,
        police_memo,
        rescue_name,
        age,
        rescue_status,
    } = useSelector(state => state.admission);

    const handlesubmit = () => {
        dispatch(resetAll());
        localStorage.removeItem('admissionState');
    }

    return (
        <div>
            <input
                value={referred_by}
                onChange={e => dispatch(setField({ field: 'referred_by', value: e.target.value }))}
                placeholder="Referred By"
            />
            <input
                value={from_place}
                onChange={e => dispatch(setField({ field: 'from_place', value: e.target.value }))}
                placeholder="From Place"
            />
            <input
                value={date_time}
                onChange={e => dispatch(setField({ field: 'date_time', value: e.target.value }))}
                placeholder="Date & Time"
            />
            <input
                value={police_memo}
                onChange={e => dispatch(setField({ field: 'police_memo', value: e.target.value }))}
                placeholder="Police Memo"
            />
            <input
                value={rescue_name}
                onChange={e => dispatch(setField({ field: 'rescue_name', value: e.target.value }))}
                placeholder="Rescue Name"
            />
            <input
                value={age}
                onChange={e => dispatch(setField({ field: 'age', value: e.target.value }))}
                placeholder="Age"
            />
            <input
                value={rescue_status}
                onChange={e => dispatch(setField({ field: 'rescue_status', value: e.target.value }))}
                placeholder="Rescue Status"
            />

            <button onClick={handlesubmit}>Submit</button>
            {/* other fields similarly */}
        </div>
    );
};

export default PDF_preview;
