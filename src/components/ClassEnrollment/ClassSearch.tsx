import type { FC, KeyboardEvent } from 'react';
import { FormEvent, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Input, Stack, SvgIcon, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

interface Filters {
	name?: string;
}

interface ClassSearchProps {
	onFiltersChange?: (filters: Filters) => void;
	'data-isloading': boolean;
}

export const ClassSearch: FC<ClassSearchProps> = (props) => {
	const { onFiltersChange, ...other } = props;
	const queryRef = useRef<HTMLInputElement | null>(null);
	const [filters, setFilters] = useState<Filters>({});
	const [inputValue, setInputValue] = useState<string>('');

	const handleQueryChange = useCallback((event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		setInputValue(queryRef.current?.value || '');
	}, []);

	const handleSearchClass = () => {
		onFiltersChange?.(filters);
	};

	return (
		<div {...other}>
			<Stack
				alignItems="center"
				component="form"
				direction="row"
				onSubmit={handleQueryChange}
				spacing={2}
				sx={{ p: 2 }}>
				<SvgIcon>
					<SearchMdIcon />
				</SvgIcon>
				<Input
					disableUnderline
					fullWidth
					inputProps={{ ref: queryRef }}
					placeholder="Search by class name"
					sx={{ flexGrow: 1 }}
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						setFilters({ name: e.target.value });
					}}
					onKeyDown={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							handleSearchClass();
						}
					}}
				/>
				<LoadingButton
					onClick={handleSearchClass}
					loading={props['data-isloading']}
					variant="outlined">
					Search
				</LoadingButton>
			</Stack>
		</div>
	);
};

ClassSearch.propTypes = {
	onFiltersChange: PropTypes.func,
};
