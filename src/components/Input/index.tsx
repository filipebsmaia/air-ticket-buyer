import React, { JSX } from 'react';
import styles from './index.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
}

const Input = ({ id, text, ...rest }: InputProps): JSX.Element => {
  return (
    <div className={styles.container}>
      {text && <label htmlFor={id}>{text}</label>}
      <input className={styles.button} {...rest} />
    </div>
  );
};

export default Input;
