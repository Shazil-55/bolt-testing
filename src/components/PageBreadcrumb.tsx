import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import Link from "@fuse/core/Link";

type PageBreadcrumbProps = BreadcrumbsProps & {
	className?: string;
	breadcrumbHistory: { title: string; parentId: string }[];
	onBreadcrumbClick: (index: number) => void; // Add onBreadcrumbClick prop
};

function PageBreadcrumb(props: PageBreadcrumbProps) {
	const { className, breadcrumbHistory, onBreadcrumbClick, ...rest } = props;

	return (
		<Breadcrumbs
			classes={{ ol: "list-none m-0 p-0" }}
			className={clsx("flex w-full", className)}
			aria-label="breadcrumb"
			color="primary"
			{...rest}
		>
			{/* Home breadcrumb */}
			<Typography
				component={Link}
				to="/faqs"
				className="block font-medium tracking-tight capitalize max-w-128 truncate"
			>
				Faqs
			</Typography>

			{/* Dynamic breadcrumb items */}
			{breadcrumbHistory.map((item, index) => (
				<Typography
					component={Link}
					to={`/faq?parentId=${item.parentId}`}
					key={index}
					className="block font-medium tracking-tight capitalize max-w-128 truncate"
					role="button"
					onClick={(e) => {
						e.preventDefault(); // Prevent default link behavior
						onBreadcrumbClick(index); // Call the callback function
					}}
				>
					{item.title}
				</Typography>
			))}
		</Breadcrumbs>
	);
}

export default PageBreadcrumb;
