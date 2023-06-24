import React, { useState, useEffect } from 'react';
import { Section } from '@/types/class';
import axios from 'axios';

export default function EnrolledClassesList() {
	const [sections, setSections] = useState<Section[]>();

	useEffect(() => {
		const getEcrolledClasses = async () => {
			try {
				const response = await axios.get(`/api/getEnrolledClasses`);
				// console.log(response);
				// const updatedData = response.data.map((obj: any) => {
				// 	const { class, classId, ...rest } = obj;
				// 	rest.name = obj.class.code;
				// 	rest.instructor = obj.instructor.name;
				// 	return rest;
				// });
				// if (isMounted()) {
				setSections(response.data.sections);
				// }
			} catch (err) {
				console.error(err);
			}
		};
		getEcrolledClasses();
	}, []);

	return (
		<>
			<div>EnrolledClassesList</div>
			{sections?.map((section) => (
				<div key={section.id}>{section.class.code}</div>
			))}
		</>
	);
}
