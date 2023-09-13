import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Badge,
	Box,
	CircularProgress,
	Dialog,
	DialogContent,
	Divider,
	IconButton,
	InputAdornment,
	Stack,
	SvgIcon,
	TextField,
	Typography,
	Autocomplete,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import { User } from '@prisma/client';

interface FilmOptionType {
	inputValue?: string;
	title: string;
	year?: number;
}
const filter = createFilterOptions<FilmOptionType>();

const o: readonly FilmOptionType[] = [
	{
		title: 'The Lord of the Rings: The Return of the King',
		year: 2003,
	},
	{ title: 'The Good, the Bad and the Ugly', year: 1966 },
	{ title: 'Fight Club', year: 1999 },
	{
		title: 'The Lord of the Rings: The Fellowship of the Ring',
		year: 2001,
	},
	{
		title: 'Star Wars: Episode V - The Empire Strikes Back',
		year: 1980,
	},
	{ title: 'Forrest Gump', year: 1994 },
	{ title: 'Inception', year: 2010 },
];

const SearchBox: FC = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	// const [serachOptions, setSearchOptions] = useState([]);

	// useEffect(() => {
	// 	const getSearchOptions = async () => {
	// 		try {
	// 			const response = await axios.get(`/api/getSearchOptions`);
	// 			setSearchOptions(response.data.sections);
	// 		} catch (err) {
	// 			console.error(err);
	// 		}
	// 	};
	// 	getSearchOptions();
	// }, []);

	const handleSearch = (searchQuery: string) => {
		// Redirect to search results page with the search term as a query parameter
		router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
	};

	return (
		// <Autocomplete
		// 	freeSolo
		// 	sx={{ width: 500 }}
		// 	value={searchQuery}
		// 	onChange={(event, value) => {
		// 		if (value != null) {
		// 			setSearchQuery(value as string);
		// 			handleSearch(value as string);
		// 		}
		// 	}}
		// 	options={o}
		// 	filterOptions={(options, params) => {
		// 		const filtered = filter(options, params);

		// 		if (params.inputValue !== '') {
		// 			filtered.push({
		// 				inputValue: params.inputValue,
		// 				title: `Search "${params.inputValue}"`,
		// 			});
		// 		}
		// 		console.log(filtered);
		// 		return filtered;
		// 	}}
		// 	getOptionLabel={(option) => {
		// 		// e.g value selected with enter, right from the input
		// 		console.log('option', option);
		// 		if (typeof option === 'string') {
		// 			return option;
		// 		}
		// 		if (option.inputValue) {
		// 			return option.inputValue;
		// 		}
		// 		return option.title + 'abc';
		// 	}}
		// 	renderOption={(props, option) => (
		// 		<li {...props}>
		// 			<SearchMdIcon style={{ marginRight: '8px' }} />
		// 			{option.title}
		// 		</li>
		// 	)}
		// 	renderInput={(params) => (
		// 		<TextField
		// 			{...params}
		// 			onChange={(event) => {
		// 				setSearchQuery(event.target.value);
		// 			}}
		// 			// fullWidth
		// 			InputProps={{
		// 				...params.InputProps,
		// 				startAdornment: (
		// 					<>
		// 						<InputAdornment position="start">
		// 							<SvgIcon>
		// 								<SearchMdIcon />
		// 							</SvgIcon>
		// 						</InputAdornment>
		// 						{params.InputProps.startAdornment}
		// 					</>
		// 				),
		// 			}}
		// 			placeholder="Search..."
		// 			variant="outlined"
		// 		/>
		// 	)}
		// 	onKeyDown={(event) => {
		// 		if (event.key === 'Enter') {
		// 			event.defaultPrevented = true;
		// 			router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
		// 		}
		// 	}}
		// />
		<TextField
			onChange={(event) => {
				setSearchQuery(event.target.value);
			}}
			style={{ width: 300 }}
			InputProps={{
				startAdornment: (
					<>
						<InputAdornment position="start">
							<SvgIcon>
								<SearchMdIcon />
							</SvgIcon>
						</InputAdornment>
					</>
				),
			}}
			placeholder="Search..."
			variant="outlined"
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					event.defaultPrevented = true;
					router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
				}
			}}
		/>
	);
};

export default SearchBox;
