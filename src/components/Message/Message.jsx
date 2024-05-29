import './Message.css';
const Message = ( props ) => {
    const anyClickHandler = () => {
        if(props.anyClickCallback)
        {
            props.anyClickCallback();
        }
    };
    if (props.isRender)
    {
        return (
            <div className="messageContainer" onClick={anyClickHandler}>
                { props.children }
            </div>
        );
    }

};

export default Message;