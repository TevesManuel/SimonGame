import './BoxContainer.css';

const BoxContainer = ( props ) => {
    return (
        <div className='boxContainer'>
            { props.children }
        </div>
    );
};

export default BoxContainer;