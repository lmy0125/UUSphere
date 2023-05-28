import React, { useState, useEffect } from 'react';
import { Class_test } from '@prisma/client';
import axios from 'axios';

export default function EnrolledClassesList() {
	const [classes, setClasses] = useState<Class_test[]>();

	useEffect(() => {
		const getEcrolledClasses = async () => {
			try {
				const response = await axios.get(`/api/getEnrolledClasses`);
				// if (isMounted()) {
				setClasses(response.data);
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
			{classes?.map((c) => (
				<div key={c.id}>{c.class_name}</div>
			))}
		</>
	);
}
