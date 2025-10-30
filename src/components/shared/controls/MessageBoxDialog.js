import { Text } from 'react-native';

const MessageBoxDialog = ({ show, onOk, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <Text>{message}</Text>
        <div className="dialog-buttons">
          <button onClick={onOk}>Ok</button>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxDialog;