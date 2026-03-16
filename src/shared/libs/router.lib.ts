import { RequestHandler, Router as ExpressRouter } from 'express';

import { Middleware } from '@/transport/middlewares';

type MiddlewareEntry = keyof Middleware | string;
type T_KeyMiddlewares = MiddlewareEntry[];

export abstract class Router<T> extends Middleware {
	private router: ExpressRouter;
	private prefix: string;
	protected controller: T;

	constructor(router: ExpressRouter, prefix: string = '', controller: T) {
		super();
		this.router = router;
		this.prefix = prefix;
		this.controller = controller;
	}

	/**
	 * Map Middleware Function
	 *
	 * @param middlewares
	 * @returns
	 */
	private mapMiddleware(middlewares: T_KeyMiddlewares = []) {
		return middlewares
			.map((middleware) => {
				if (
					typeof middleware === 'string' &&
					middleware.startsWith('roles:')
				) {
					const [_, roleName] = middleware.split(':');
					const fn = this.roles(roleName);
					return fn;
				}

				const middlewareFunction = this[middleware as keyof Middleware];
				if (typeof middlewareFunction !== 'function') return null;
				return middlewareFunction.bind(this);
			})
			.filter((middleware) => middleware !== null);
	}

	/**
	 * Router GET
	 *
	 * @param path
	 * @param controller
	 * @param middlewares
	 */
	protected get(
		path: string,
		controller: RequestHandler,
		middlewares: T_KeyMiddlewares = [],
	) {
		this.router.get(
			`${this.prefix}${path}`,
			...this.mapMiddleware(middlewares),
			controller.bind(this.controller),
		);
	}

	/**
	 * Router POST
	 *
	 * @param path
	 * @param controller
	 * @param middlewares
	 */
	protected post(
		path: string,
		controller: RequestHandler,
		middlewares: T_KeyMiddlewares = [],
	) {
		this.router.post(
			`${this.prefix}${path}`,
			...this.mapMiddleware(middlewares),
			controller.bind(this.controller),
		);
	}

	/**
	 * Router PUT
	 *
	 * @param path
	 * @param controller
	 * @param middlewares
	 */
	protected put(
		path: string,
		controller: RequestHandler,
		middlewares: T_KeyMiddlewares = [],
	) {
		this.router.put(
			`${this.prefix}${path}`,
			...this.mapMiddleware(middlewares),
			controller.bind(this.controller),
		);
	}

	/**
	 * Router DELETE
	 *
	 * @param path
	 * @param controller
	 * @param middlewares
	 */
	protected delete(
		path: string,
		controller: RequestHandler,
		middlewares: T_KeyMiddlewares = [],
	) {
		this.router.delete(
			`${this.prefix}${path}`,
			...this.mapMiddleware(middlewares),
			controller.bind(this.controller),
		);
	}
}
