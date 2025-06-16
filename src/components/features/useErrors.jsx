import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

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

export const useErrors = (submitInputRef, submitButtonRef) => {
	const {
		register,
		handleSubmit,
		reset, // удалить данные
		formState: { isValid, errors },
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

	//let emailValue = watch('email');
	let repeatPasswordValue = watch('repeatPassword');
	let passwordValue = watch('password');

	const resetForm = () => {
		reset({
			email: '',
			password: '',
			repeatPassword: '',
		});
		console.log('Form reset');
	};
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
	useEffect(() => {
		if (isValid) {
			submitButtonRef.current.focus();
		}
	}, [isValid]);

	return {
		register,
		handleSubmit,
		resetForm,
		emailError,
		passwordError,
		repeatPasswordError,
	};
};
