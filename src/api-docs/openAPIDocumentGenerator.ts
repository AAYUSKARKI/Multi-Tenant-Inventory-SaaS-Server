import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { tenantRegistry } from "@/api/tenant/tenantRouter";
import { userRegistry } from "@/api/user/userRouter";
import { itemRegistry } from "@/api/item/itemRouter";
import { warehouseRegistry } from "@/api/warehouse/warehouseRouter";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([tenantRegistry, userRegistry, itemRegistry, warehouseRegistry]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Multi-Tenant Inventory SaaS API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}