import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import Button from '@mui/material/Button';
import useJwtAuth from '../useJwtAuth';
import { FetchApiError } from '@/utils/apiFetch';
import { JwtSignInPayload } from '../JwtAuthProvider';
import * as Actions from "../../../../store/actions"
import { useEnhancedDispatch, useEnhancedSelector } from '@/helpers/reduxHooks';
import { END_POINT } from '@/helpers/constants';
import { CircularProgress } from '@mui/material';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.')
});

type FormType = JwtSignInPayload & {
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function JwtSignInForm() {
	const dispatch = useEnhancedDispatch()
	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)


	// useEffect(() => {
	// 	setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true });
	// 	setValue('password', '5;4+0IOx:\\Dy', { shouldDirty: true, shouldValidate: true });
	// }, [setValue]);

	async function onSubmit(formData: FormType) {
		try {
			setIsLoading(true)
			setErrorMsg("")
			const { email, password } = formData;
			const res = await dispatch(Actions.loginOrSignup(email, password))
			if (res) throw res
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
			console.log(error)
			if (typeof error === 'string') {
				setErrorMsg(error)
			}
		}

	}

	return (
		<form
			name="loginForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			{/* <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/#"
				>
					Forgot password?
				</Link>
			</div> */}

			<div 
				className='flex justify-center mt-5'
			>
				{
					isLoading ? <CircularProgress /> : (
						<Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Sign in
						</Button>
					)
				}
			</div>
			<p className='mt-10 text-red-700'>{errorMsg}</p>
		</form>
	);
}

export default JwtSignInForm;
