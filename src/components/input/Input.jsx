import styles from './input.module.css';

export const Input = ({ labelName, error, ref, register, registerName, ...props }) => {
	return (
		<>
			<div className={styles['form-group']}>
				<label>{labelName}</label>
				<input
					className={styles['form-input']}
					{...props}
					ref={ref}
					{...register(registerName)}
				/>
				{error && <div className={styles['error-message']}>{error}</div>}
			</div>
		</>
	);
};
