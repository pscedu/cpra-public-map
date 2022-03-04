import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>
			<span class={style.title}>Louisiana's Costal</span>
			<span class={style.title}>Master Plan 2023</span>
			<span class={style.subtitle}>Data Viewer</span>
		</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Explore</Link>
		</nav>
	</header>
);

export default Header;
