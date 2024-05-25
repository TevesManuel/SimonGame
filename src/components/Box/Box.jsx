import './Box.css';

const Box = ({ state, color, notifyFunc }) => {
    return (
        <div onClick={ () => {notifyFunc(color); }} className={ `box ${color} ${!state ? 'off' : null }` }></div>
    );
};

export default Box;