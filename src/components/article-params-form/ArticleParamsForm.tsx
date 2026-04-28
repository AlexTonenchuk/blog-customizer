import { useState, FormEvent, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';
import {
	ArticleStateType,
	OptionType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	setArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	setArticleState,
}: ArticleParamsFormProps) => {
	// Локальный стейт — индикатор открытости/закрытости панели
	const [isOpen, setIsOpen] = useState(false);

	// Локальный стейт — черновик настроек внутри формы
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);

	// Реф для отслеживания клика вне формы
	const formRef = useRef<HTMLDivElement>(null);

	// Обработчик закрытия по клику вне формы
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// Обработчик отправки формы
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setArticleState(formState); // Передаем черновик настроек формы в основной App
	};

	// Обработчик сброса формы
	const handleReset = () => {
		setFormState(defaultArticleState);
		setArticleState(defaultArticleState);
	};

	const updateFormField = (field: keyof ArticleStateType) => {
		return (value: OptionType) => {
			setFormState((prev: ArticleStateType) => ({
				...prev,
				[field]: value,
			}));
		};
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				ref={formRef}
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					{/* Шрифт */}
					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={updateFormField('fontFamilyOption')}
						title='Шрифт'
					/>

					{/* Размер шрифта */}
					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={updateFormField('fontSizeOption')}
						title='Размер шрифта'
					/>

					{/* Цвет шрифта */}
					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={updateFormField('fontColor')}
						title='Цвет шрифта'
					/>

					<Separator />

					{/* Цвет фона */}
					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={updateFormField('backgroundColor')}
						title='Цвет фона'
					/>

					{/* Ширина контента */}
					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={updateFormField('contentWidth')}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
