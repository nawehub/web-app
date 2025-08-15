import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateFolderTagRequest} from "@/types/files";
import {CreateCategoryRequest, resourceService} from "@/lib/services/resources";

export function useCreateFolderMutation() {
    return useMutation({
        mutationKey: ['createFolder'],
        mutationFn: (data: CreateFolderTagRequest) => resourceService().folder.createFolder(data),
    });
}

export const useListFoldersQuery = () => {
    return useQuery({
        queryKey: ['folders'],
        queryFn: async () => await resourceService().folder.listAllFolders()
    });
}

export const useListCategoriesQuery = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => await resourceService().category.listAllCategories()
    });
}

export function useCreateCategoryMutation() {
    return useMutation({
        mutationKey: ['create-category'],
        mutationFn: (data: CreateCategoryRequest) => resourceService().category.createCategory(data),
    });
}

export const useListTagsQuery = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => await resourceService().tag.listAllTags()
    });
}

export function useCreateTagMutation() {
    return useMutation({
        mutationKey: ['create-tag'],
        mutationFn: (data: Pick<CreateCategoryRequest, "name">) => resourceService().tag.createTag(data),
    });
}

export const useListAllResourcesQuery = () => {
    return useQuery({
        queryKey: ['all-resources'],
        queryFn: async () => await resourceService().resource.listAllResources()
    });
}

export const useListFolderResourcesQuery = (folderId: string) => {
    return useQuery({
        queryKey: ['folder-resources', folderId],
        queryFn: async () => await resourceService().resource.listFolderResources(folderId)
    });
}

export function useUploadResourceMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['upload-resource'],
        mutationFn: (data: FormData) => {
            return resourceService().resource.uploadResource(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] }).then();
            queryClient.invalidateQueries({ queryKey: ['all-resources'] }).then();
            queryClient.invalidateQueries({ queryKey: ['folder-resources'] }).then();
        },
    });
}