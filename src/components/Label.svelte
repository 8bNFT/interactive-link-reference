<script>
    export let label, small, click
</script>

<svelte:element this={click === false ? "div" : "label"} class="label" class:small>
    {#if label}
        <span>{label}</span>
    {/if}
    <slot></slot>
</svelte:element>

<style>
    .label {
        display: block;
        margin-bottom: .65rem;
        cursor: default
    }

    span {
        display: block;
        font-size: .9rem;
        opacity: .6;
        margin-bottom: .35rem
    }

    .label.small {
        margin-bottom: .15rem
    }
</style>