import styles from './App.module.css';
import { useRef, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const sendFormData = (formData) => {
	console.log(formData);
};

const fieldsScheme = yup.object().shape({
	email: yup
		.string()
		.required('Email обязателен для заполнения')
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Некорректный формат Email'),
	password: yup
		.string()
		.required('Пароль обязателен для заполнения')
		.matches(
			/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+$/,
			'Пароль должен содержать: цифру, заглавную и строчную буквы',
		)
		.min(8, 'Минимум 8 символов'),
	repeatPassword: yup
		.string()
		.required('Повторите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

export const App = () => {
	const submitButtonRef = useRef(null);
	const submitInputRef = useRef(null); // для email

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch, // для отслеживания значения пароля
		trigger, // для ручной валидации
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			repeatPassword: '',
		},
		resolver: yupResolver(fieldsScheme),
	});

	const emailValue = watch('email');
	const repeatPasswordValue = watch('repeatPassword');
	const passwordValue = watch('password');
	// ===== Без использования Yup =============
	// const emailProps = {
	// 	minLength: { value: 2, message: 'Email обязателен для заполнения' },
	// 	pattern: {
	// 		value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
	// 		message: 'Некорректный формат Email',
	// 	},
	// };

	// const passwordProps = {
	// 	minLength: { value: 8, message: 'Минимум 8 символов' },
	// 	pattern: {
	// 		value: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+$/,
	// 		message: 'Пароль должен содержать: цифру, заглавную и строчную буквы',
	// 	},
	// };

	// для валидации repeatPassword при изменении password
	// const repeatPasswordProps = {
	// 	validate: (value) => value === passwordValue || 'Пароли не совпадают',
	// };

	useEffect(() => {
		if (repeatPasswordValue) {
			trigger('repeatPassword');
		}
	}, [passwordValue, trigger, repeatPasswordValue]);

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const repeatPasswordError = errors.repeatPassword?.message;

	// фокус на кнопку
	const allFieldsFilled =
		emailValue?.trim() && passwordValue?.trim() && repeatPasswordValue?.trim();
	if (
		!emailError && // нет ошибок
		!passwordError &&
		!repeatPasswordError &&
		allFieldsFilled && // заполненные поля
		passwordValue === repeatPasswordValue && // пароли повторяются
		document.activeElement === !submitInputRef.current // фокус не на email
	)
		setTimeout(() => submitButtonRef.current.focus(), 0);

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit(sendFormData)}>
				<h2 className={styles['form-title']}>Регистрация</h2>

				<div className={styles['form-group']}>
					<label>Email</label>
					<input
						ref={submitInputRef}
						className={styles['form-input']}
						name="email"
						type="email"
						placeholder="Почта"
						// {...register('email', emailProps)} // без Yup
						{...register('email')}
					/>
					{emailError && <div className={styles['error-message']}>{emailError}</div>}
				</div>

				<div className={styles['form-group']}>
					<label>Пароль</label>
					<input
						className={styles['form-input']}
						name="password"
						type="password"
						placeholder="Пароль"
						// {...register('password', passwordProps)} // без Yup
						{...register('password')}
					/>
					{passwordError && (
						<div className={styles['error-message']}>{passwordError}</div>
					)}
				</div>

				<div className={styles['form-group']}>
					<label>Повторите пароль</label>
					<input
						className={styles['form-input']}
						name="repeatPassword"
						type="password"
						placeholder="Повторите пароль"
						// {...register('repeatPassword', repeatPasswordProps)} // без Yup
						{...register('repeatPassword')}
					/>
					{repeatPasswordError && (
						<div className={styles['error-message']}>{repeatPasswordError}</div>
					)}
				</div>

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
