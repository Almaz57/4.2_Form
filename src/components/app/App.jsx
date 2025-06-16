import styles from './App.module.css';
import { useRef } from 'react';
import { Input } from '../../components';
import { useErrors } from '../features/useErrors';

const sendFormData = (formData, resetForm) => {
	console.log('email', formData.email);
	console.log('password', formData.password);
	console.log('repeatPassword', formData.repeatPassword);
	resetForm();
};

export const App = () => {
	const submitButtonRef = useRef(null);
	const submitInputRef = useRef(null); // для email

	const { register, handleSubmit, resetForm, emailError, passwordError, repeatPasswordError } =
		useErrors(submitInputRef, submitButtonRef);

	const onSubmit = (data) => {
		sendFormData(data, resetForm);
	};

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<h2 className={styles['form-title']}>Регистрация</h2>

				<Input
					labelName="Email"
					error={emailError}
					ref={submitInputRef}
					name="email"
					type="email"
					placeholder="Почта"
					register={register}
					registerName="email"
				></Input>

				<Input
					labelName="Пароль"
					error={passwordError}
					name="password"
					type="password"
					placeholder="Пароль"
					register={register}
					registerName="password"
				></Input>

				<Input
					labelName="Повторите пароль"
					error={repeatPasswordError}
					name="repeatPassword"
					type="password"
					placeholder="Повторите пароль"
					register={register}
					registerName="repeatPassword"
				></Input>

				<button
					ref={submitButtonRef}
					className={styles['submit-btn']}
					type="submit"
					disabled={!!passwordError || !!repeatPasswordError || !!emailError}
				>
					Зарегистрироваться
				</button>
			</form>
		</>
	);
};
